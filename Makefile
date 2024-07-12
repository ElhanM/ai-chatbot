.PHONY: ai-chatbot infra app api

# make ai-chatbot
ai-chatbot: infra api app 

infra:
	cd infra && docker compose up -d

api:
	cd api && air &

app:
	cd app && . ~/.nvm/nvm.sh && nvm use && npm run start
