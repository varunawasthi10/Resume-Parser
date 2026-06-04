$filePath = "c:\VARUN\Resume Parser\frontend\src\pages\LandingPage.jsx"
$content = [System.IO.File]::ReadAllText($filePath)
$content = $content.Replace('space-y-3', 'flex flex-col gap-3')
$content = $content.Replace('space-y-4', 'flex flex-col gap-4')
$content = $content.Replace('space-y-5', 'flex flex-col gap-5')
$content = $content.Replace('space-y-6', 'flex flex-col gap-6')
[System.IO.File]::WriteAllText($filePath, $content)
Write-Host "Done - replaced all space-y with flex flex-col gap"
