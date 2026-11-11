#!/usr/bin/env bash
# Build noteblock for iOS, archive it, and upload it to TestFlight.
#
#   npm run ios:release            # build number = date.time, e.g. 261028.1530
#   npm run ios:release -- 42      # explicit build number
#
# Signing and upload use an App Store Connect API key (Admin), so no Apple ID
# or shared signing certificate is needed. Put the key details in ios/asc.env
# (gitignored) or the environment:
#
#   ASC_KEY_ID=XXXXXXXXXX
#   ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
#   ASC_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_XXXXXXXXXX.p8   # optional, this is the default
#
# Without a key it falls back to the Apple ID signed in to Xcode. The version
# shown in the store (1.0) is MARKETING_VERSION in the Xcode project.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f ios/asc.env ]; then set -a; . ios/asc.env; set +a; fi

AUTH=()
if [ -n "${ASC_KEY_ID:-}" ]; then
  : "${ASC_ISSUER_ID:?ASC_ISSUER_ID is required with ASC_KEY_ID}"
  ASC_KEY_PATH="${ASC_KEY_PATH:-$HOME/.appstoreconnect/private_keys/AuthKey_$ASC_KEY_ID.p8}"
  ASC_KEY_PATH="${ASC_KEY_PATH/#\~/$HOME}"
  [ -f "$ASC_KEY_PATH" ] || { echo "API key not found: $ASC_KEY_PATH" >&2; exit 1; }
  AUTH=(-authenticationKeyPath "$ASC_KEY_PATH" -authenticationKeyID "$ASC_KEY_ID" -authenticationKeyIssuerID "$ASC_ISSUER_ID")
fi

BUILD_NUMBER="${1:-$(date +%y%m%d.%H%M)}"
ARCHIVE=build/ios/noteblock.xcarchive

npm run build
npx cap sync ios

xcodebuild archive \
  -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE" \
  -allowProvisioningUpdates ${AUTH[@]+"${AUTH[@]}"} \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

xcodebuild -exportArchive \
  -archivePath "$ARCHIVE" \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath build/ios/export \
  -allowProvisioningUpdates ${AUTH[@]+"${AUTH[@]}"}

echo "Uploaded build $BUILD_NUMBER. It shows in App Store Connect > TestFlight after processing (~10-30 min)."
