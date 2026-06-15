from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class AppConfig(BaseSettings):
    app_name: str 
    app_env: str 
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    pinecone_api_key: str
    pinecone_index: str

    google_api_key: str | None = None
    deep_seek_api_key: str | None = None
    groq_api_key: str | None = None
    serpapi_api_key: str | None = None

    exchange_rate_api_key: str | None = None
    weatherstack_api_key: str | None = None
    alpha_vantage_api_key: str | None = None
    huggingfacehub_api_token: str | None = None

    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    langsmith_tracing_v2: bool | None = None
    langsmith_endpoint: str | None = None
    langsmith_api_key: str | None = None
    langchain_project: str | None = None

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache # This will not fetch env everytime instead cache it
def getAppConfig():
    return AppConfig() # type ignore 