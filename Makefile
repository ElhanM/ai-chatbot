.PHONY: ai-chatbot infra app api

# make ai-chatbot
ai-chatbot: infra api app 

infra:
	cd infra && docker compose up -d && sleep 2

api:
	cd golang-api && air &

app:
	cd mobile-app && . ~/.nvm/nvm.sh && nvm use && npm run start
