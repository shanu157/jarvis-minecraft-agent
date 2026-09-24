# JARVIS Minecraft Agent — Astra

Cloud-hosted autonomous Minecraft Bedrock agent controlled through JARVIS.

## Architecture

JARVIS Android
    |
    | HTTPS
    v
Astra Cloud API
    |
    +-- Astra AI brain
    +-- scheduler
    +-- memory
    +-- Minecraft controller
    |
    v
Void SMP Bedrock

## Server

Host:
Void_SMP-6MTk.aternos.me

Port:
63005

Bedrock:
1.26.51.1

## API

GET /health

GET /api/astra/status

GET /api/astra/schedule

POST /api/astra/chat

POST /api/astra/schedule

## Security

Never commit:

- Microsoft passwords
- Microsoft authentication tokens
- Aternos passwords
- API secrets
- .env files

The long-term goal is an Astra-style agent that can observe,
plan, execute Minecraft actions, remember previous objectives,
recover from mistakes, and operate autonomously during configured
play time.
