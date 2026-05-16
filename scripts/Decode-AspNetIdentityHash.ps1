# Decode-AspNetIdentityHash.ps1
# Usage: .\Decode-AspNetIdentityHash.ps1 "YOUR_HASH_HERE"

param (
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Hash
)

function Get-Int32BE {
    param($bytes, $offset)
    if ($null -eq $bytes -or $bytes.Length -lt ($offset + 4)) { return 0 }
    return [Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, $offset))
}

try {
    $data = [Convert]::FromBase64String($Hash)
    if ($data.Length -lt 1) {
        Write-Error "Invalid hash length."
        return
    }

    $version = $data[0]
    Write-Host "--- ASP.NET Identity Hash Info ---"
    Write-Host "Format Version: $version (V$($version + 2))"

    if ($version -eq 1) {
        # V3 format: [version] [PRF] [iter count] [salt size] [salt] [hash]
        $prf = [uint32](Get-Int32BE $data 1)
        $iterations = [uint32](Get-Int32BE $data 5)
        $saltSize = [uint32](Get-Int32BE $data 9)
        
        $prfName = switch ($prf) {
            0 { "HMACSHA1" }
            1 { "HMACSHA256" }
            2 { "HMACSHA512" }
            Default { "Unknown ($prf)" }
        }

        $salt = $data[13..(13 + $saltSize - 1)]
        $subKey = $data[(13 + $saltSize)..($data.Length - 1)]

        Write-Host "PRF: $prfName"
        Write-Host "Iterations: $iterations"
        Write-Host "Salt Size: $saltSize bytes"
        Write-Host "Salt (Base64): $([Convert]::ToBase64String($salt))"
        Write-Host "Password Hash (Base64): $([Convert]::ToBase64String($subKey))"
    }
    elseif ($version -eq 0) {
        # V2 format: [version] [salt: 16 bytes] [hash: 20 bytes]
        if ($data.Length -lt 37) {
            Write-Error "V2 hash too short."
            return
        }
        $salt = $data[1..16]
        $subKey = $data[17..36]

        Write-Host "Algorithm: PBKDF2 with HMAC-SHA1"
        Write-Host "Iterations: 1000 (Default for V2)"
        Write-Host "Salt (Base64): $([Convert]::ToBase64String($salt))"
        Write-Host "Password Hash (Base64): $([Convert]::ToBase64String($subKey))"
    }
    else {
        Write-Host "Unsupported version: $version"
    }
}
catch {
    Write-Error "Error decoding hash: $_"
}
