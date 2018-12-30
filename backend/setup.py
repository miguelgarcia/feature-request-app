from setuptools import setup

setup(
    name='feature-request-app',
    entry_points={
        'console_scripts': [
            'fra=app.commands:cli'
        ],
    },
)