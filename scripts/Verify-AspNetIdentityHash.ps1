param (
    [Parameter(Mandatory=$true)] [string]$Hash,
    [Parameter(Mandatory=$true)] [string]$Password
)

function Get-Int32BE {
    param($bytes, $offset)
    return [Net.IPAddress]::NetworkToHostOrder([BitConverter]::ToInt32($bytes, $offset))
}

try {
    $data = [Convert]::FromBase64String($Hash)
    $version = $data[0]

    if ($version -ne 1) {
        Write-Error "This script currently only supports V3 hashes (Version 1)."
        return
    }

    $prf = [uint32](Get-Int32BE $data 1)
    $iterations = [uint32](Get-Int32BE $data 5)
    $saltSize = [uint32](Get-Int32BE $data 9)
    $salt = $data[13..(13 + $saltSize - 1)]
    $storedSubkey = $data[(13 + $saltSize)..($data.Length - 1)]

    # Map PRF to HashAlgorithmName
    $algorithm = switch ($prf) {
        0 { "SHA1" }
        1 { "SHA256" }
        2 { "SHA512" }
        Default { throw "Unknown PRF" }
    }

    Write-Host "Verifying with $algorithm, $iterations iterations..."

    # Perform PBKDF2
    $pbkdf2 = [System.Security.Cryptography.Rfc2898DeriveBytes]::new($Password, $salt, $iterations, $algorithm)
    $generatedSubkey = $pbkdf2.GetBytes($storedSubkey.Length)

    # Compare
    $match = $true
    for ($i = 0; $i -lt $storedSubkey.Length; $i++) {
        if ($storedSubkey[$i] -ne $generatedSubkey[$i]) {
            $match = $false
            break
        }
    }

    if ($match) {
        Write-Host "✅ MATCH! The password is correct." -ForegroundColor Green
    } else {
        Write-Host "❌ NO MATCH. Incorrect password." -ForegroundColor Red
    }
} catch {
    Write-Error "Error: $_"
}
