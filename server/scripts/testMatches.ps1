$body = @{ email = 'test@student.edu'; password = 'supersecret' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -ContentType 'application/json' -Body $body
$token = $login.token
$userId = $login.user._id
Write-Host "token: $token"

$matches = Invoke-RestMethod -Uri "http://localhost:5000/api/matches/$userId" -Headers @{ Authorization = "Bearer $token" }
Write-Host 'matches:'
$matches | ConvertTo-Json -Depth 5
