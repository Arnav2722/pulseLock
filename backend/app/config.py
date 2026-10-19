from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "PulseLock Enterprise EHR"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./pulselock_prod.db"
    SECRET_KEY: str = "prod-super-secure-hmac-audit-chain-secret-key-2026"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "*"]

    class Config:
        env_file = ".env"


settings = Settings()
