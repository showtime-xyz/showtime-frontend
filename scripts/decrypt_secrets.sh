#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$SERVICE_ACCOUNT_KEY_SECRET_PASSPHRASE" \
--output ../apps/expo/service-account-key.json ../apps/expo/service-account-key.json.gpg

gpg --quiet --batch --yes --decrypt --passphrase="$GOOGLE_SERVICES_SECRET_PASSPHRASE" \
--output ../apps/expo/google-services.json ../apps/expo/google-services.json.gpg