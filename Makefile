.PHONY: ai-chatbot infra app api

# make ai-chatbot
ai-chatbot: infra app api

infra:
	cd infra && docker compose up -d

app:
	cd app && . ~/.nvm/nvm.sh && nvm use && npm run start &

api:
	cd api && air
