import os
import asyncio
from aiohttp import ClientSession, ClientTimeout
import asyncpg
import logging
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class ClashOfClansAPI:
    def __init__(self, coc_api_key: str, session: ClientSession):
        self.session = session
        self.COC_API_BASE_URL = "https://cocproxy.royaleapi.dev"
        self.coc_api_key = coc_api_key
        self.headers = {
            "Authorization": f"Bearer {self.coc_api_key}",
            "Accept": "application/json",
        }

    async def fetch(self, url: str) -> Dict[str, Any]:
        async with self.session.get(url, headers=self.headers) as response:
            if response.status != 200:
                logger.error(f"Error fetching {url}: {response.status}")
                return {}
            return await response.json()

    async def get_clan_members(self, clan_tag: str) -> List[Dict[str, Any]]:
        clan_tag_encoded = clan_tag.replace("#", "%23")
        url = f"{self.COC_API_BASE_URL}/v1/clans/{clan_tag_encoded}/members"
        
        async with self.session.get(url, headers=self.headers) as response:
            if response.status != 200:
                logger.error(
                    f"Error fetching clan members for {clan_tag}: {response.status}"
                )
                return []
            data = await response.json()
            return data.get("items", [])


class DatabaseManager:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        try:
            self.pool = await asyncpg.create_pool(self.db_url)
            logger.info("Database connection pool created successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to the database: {e}")
            raise

    async def close(self):
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed.")

    async def fetch_cwl_clans(self) -> List[Dict[str, Any]]:
        if not self.pool:
            return []
        async with self.pool.acquire() as connection:
            rows = await connection.fetch("SELECT * FROM cwl_clan_table")
            return [dict(row) for row in rows]

    async def fetch_cwl_applications(self) -> List[Dict[str, Any]]:
        if not self.pool:
            return []
        async with self.pool.acquire() as connection:
            rows = await connection.fetch("SELECT * FROM cwl_table")
            return [dict(row) for row in rows]


class DiscordNotifier:
    def __init__(self, webhook_url: str, session: ClientSession):
        self.webhook_url = webhook_url
        self.session = session

    async def send_notification(self, user_ids: List[str]):
        mentions = [f"<@{user_id}>" for user_id in user_ids]
        header = "**JOIN CWL CLANS ASAP!**\n"

        max_length = 2000
        messages: List[str] = []
        current_message = header

        for mention in mentions:
            if len(current_message) + len(mention) + 1 > max_length:
                messages.append(current_message)
                current_message = header
            
            current_message += f" {mention}"

        if current_message != header:
            messages.append(current_message)

        for message in messages:
            payload = {"content": message.strip()}
            async with self.session.post(self.webhook_url, json=payload) as response:
                if 200 <= response.status < 300:
                    logger.info("Notification sent successfully.")
                else:
                    logger.error(
                        f"Failed to send notification: {response.status} {await response.text()}"
                    )


async def main():
    load_dotenv()
    COC_API_KEY = os.getenv("API_TOKEN")
    DB_URL = os.getenv("DATABASE_URL")
    DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

    if not all([COC_API_KEY, DB_URL, DISCORD_WEBHOOK_URL]):
        logger.error("Missing environment variables. Please check your .env file.")
        return

    db_manager = DatabaseManager(DB_URL)
    
    try:
        await db_manager.connect()

        async with ClientSession(timeout=ClientTimeout(total=20)) as session:
            clash_api = ClashOfClansAPI(COC_API_KEY, session)
            discord_notifier = DiscordNotifier(DISCORD_WEBHOOK_URL, session)
            
            cwl_clans = await db_manager.fetch_cwl_clans()
            cwl_applications = await db_manager.fetch_cwl_applications()

            if not cwl_clans:
                logger.warning("No CWL clans found in the database. Exiting.")
                return
            if not cwl_applications:
                logger.info("No CWL applications found in the database. Nothing to check.")
                return

            clan_members_tasks = [clash_api.get_clan_members(clan["tag"]) for clan in cwl_clans]
            results = await asyncio.gather(*clan_members_tasks)
            
            for clan, members in zip(cwl_clans, results):
                clan_tag = clan.get('tag', 'N/A')
                logger.info(f"Clan {clan_tag} has {len(members)} members.")
            
            all_clan_members = [member for sublist in results for member in sublist]
            in_clan_player_tags = {member["tag"] for member in all_clan_members}
            
            user_ids_to_notify = list(set(
                app["user_id"]
                for app in cwl_applications
                if app["account_tag"] not in in_clan_player_tags
            ))

            if user_ids_to_notify:
                logger.info(
                    f"Notifying {len(user_ids_to_notify)} users who haven't joined."
                )
                await discord_notifier.send_notification(user_ids_to_notify)
            else:
                logger.info(
                    "All applicants have joined a CWL clan or there are no applicants to notify."
                )

    except Exception as e:
        logger.critical(f"A critical error occurred in the main process: {e}", exc_info=True)
    finally:
        await db_manager.close()

async def run_scheduled_checks():
    total_runs = 4
    # 2 hours in seconds
    wait_interval_seconds = 2 * 60 * 60 

    for i in range(total_runs):
        run_number = i + 1
        logger.info(f"--- Starting run {run_number}/{total_runs} ---")
        
        await main()
        
        logger.info(f"--- Finished run {run_number}/{total_runs} ---")
        
        if run_number < total_runs:
            logger.info("Waiting for 2 hours before the next run...")
            await asyncio.sleep(wait_interval_seconds)
            
    logger.info("All scheduled runs are complete. Exiting script.")


if __name__ == "__main__":
    asyncio.run(run_scheduled_checks())