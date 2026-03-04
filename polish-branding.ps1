$targetFiles = Get-ChildItem -Recurse -Include "*.tsx","*.css" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }

foreach ($file in $targetFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    
    # 1. First, fix the 'hover:bg-emerald-600' that might have been created by accident
    $content = $content -replace 'hover:bg-emerald-600', 'hover:bg-emerald-700'
    
    # 2. Replace primary brand blue/teal with emerald on common button/accent patterns
    $content = $content -replace 'bg-\[#1D3557\]', 'bg-emerald-600'
    $content = $content -replace 'bg-\[#34A0A4\]', 'bg-emerald-600'
    $content = $content -replace 'bg-\[#38A36D\]', 'bg-emerald-600'
    
    # 3. Handle hover colors
    $content = $content -replace 'hover:bg-\[#1D3557\]', 'hover:bg-emerald-700'
    $content = $content -replace 'hover:bg-\[#34A0A4\]', 'hover:bg-emerald-700'
    $content = $content -replace 'hover:text-\[#34A0A4\]', 'hover:text-emerald-700'
    $content = $content -replace 'hover:border-\[#34A0A4\]', 'hover:border-emerald-600'
    
    # 4. Accent text and borders
    $content = $content -replace 'text-\[#34A0A4\]', 'text-emerald-600'
    $content = $content -replace 'border-\[#34A0A4\]', 'border-emerald-600'
    $content = $content -replace 'bg-\[#34A0A4\]\/10', 'bg-emerald-50'
    
    # 5. Shadows
    $content = $content -replace 'rgba\(29,53,87,0\.2\)', 'rgba(5,150,105,0.2)'
    $content = $content -replace 'rgba\(29,53,87,0\.15\)', 'rgba(5,150,105,0.15)'
    $content = $content -replace 'rgba\(29,53,87,0\.02\)', 'rgba(5,150,105,0.02)'
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Polished: $($file.Name)"
    }
}
Write-Host "Branding polished to Emerald Green."
