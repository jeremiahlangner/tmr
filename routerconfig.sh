#!/usr/bin/env bash
set -x

admin_pass="REPLACE WITH PASSWORD FROM STICKER ON ROUTER"

# this creates json object for obtaining token
auth_payload=$(echo '{"username": "admin", "password": ""}' | jq -c ".password = \"${admin_pass}\"")
# this obtains a token from the router
token=$(curl -s -d "${auth_payload}" http://192.168.12.1/TMI/v1/auth/login | jq -r ".auth.token")
# this gets the old config
old_ap_config=$(curl -s -H "Authorization: Bearer ${token}" "http://192.168.12.1/TMI/v1/network/configuration?get=ap")
# this modifies the old config in memory (no temp file in c:\ required)
new_ap_config=$(echo ${old_ap_config}|jq -c ".[\"2.4ghz\"].isRadioEnabled |= false | .[\"5.0ghz\"].isRadioEnabled |= false")
# this publishes the new config to the router
curl -s -H "Authorization: Bearer ${token}" -d "${new_ap_config}" "http://192.168.12.1/TMI/v1/network/configuration?set=ap"
