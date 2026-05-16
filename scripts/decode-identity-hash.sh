#!/bin/bash
# decode-identity-hash.sh
# Usage: ./decode-identity-hash.sh "AQAAAAIAAYagAAAAEO/9lDX2jfGJlcxaL0wn88fzCP4EecL/7aT6yFD/t7DeH4WJCsd/JUEUkXmd8Jfpeg=="

if [ -z "$1" ]; then
    echo "Usage: $0 <base64_hash>"
    exit 1
fi

HASH_B64=$1
# Decode to hex stream
HEX=$(echo "$HASH_B64" | base64 --decode | xxd -p | tr -d '\n')

VERSION=${HEX:0:2}

echo "--- ASP.NET Identity Hash Info ---"
if [ "$VERSION" == "01" ]; then
    echo "Format Version: V3"
    
    PRF_HEX=${HEX:2:8}
    ITER_HEX=${HEX:10:8}
    SALT_SIZE_HEX=${HEX:18:8}
    
    PRF=$((16#$PRF_HEX))
    ITER=$((16#$ITER_HEX))
    SALT_SIZE=$((16#$SALT_SIZE_HEX))
    
    case $PRF in
        0) PRF_NAME="HMACSHA1" ;;
        1) PRF_NAME="HMACSHA256" ;;
        2) PRF_NAME="HMACSHA512" ;;
        *) PRF_NAME="Unknown ($PRF)" ;;
    esac
    
    echo "PRF: $PRF_NAME"
    echo "Iterations: $ITER"
    echo "Salt Size: $SALT_SIZE bytes"
    
    SALT_HEX=${HEX:26:$((SALT_SIZE * 2))}
    HASH_VAL_HEX=${HEX:$((26 + SALT_SIZE * 2))}
    
    echo "Salt (Hex): $SALT_HEX"
    echo "Hash (Hex): $HASH_VAL_HEX"
    
    # Convert hex to base64 for salt and hash
    echo "Salt (Base64): $(echo $SALT_HEX | xxd -r -p | base64)"
    echo "Hash (Base64): $(echo $HASH_VAL_HEX | xxd -r -p | base64)"

elif [ "$VERSION" == "00" ]; then
    echo "Format Version: V2"
    SALT_HEX=${HEX:2:32}
    HASH_VAL_HEX=${HEX:34:40}
    echo "Salt (Base64): $(echo $SALT_HEX | xxd -r -p | base64)"
    echo "Hash (Base64): $(echo $HASH_VAL_HEX | xxd -r -p | base64)"
else
    echo "Unknown Version: $VERSION"
fi
