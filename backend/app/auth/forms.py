from wtforms import Form,StringField, PasswordField, validators

class LoginForm(Form):
    email = StringField('Email Address', [validators.Length(min=6, max=255)])
    password = PasswordField('Password', [validators.Required()])
