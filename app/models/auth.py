from pydantic import BaseModel, Field, EmailStr, ValidationInfo, field_validator


class Login(BaseModel):
    email : EmailStr
    password : str = Field(..., min_length=6, max_length=128)


class Register(BaseModel):
    name : str = Field(..., min_length=2, max_length=50)
    email : EmailStr
    password : str = Field(..., min_length=6, max_length=128)
    confirm_password : str = Field(..., min_length=6, max_length=128)

    @field_validator('confirm_password')
    def password_match(cls, value: str, info: ValidationInfo):
        if "password" in info.data and value != info.data['password']:
            raise ValueError('passwords do not match')
        return value