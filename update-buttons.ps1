$replacements = @(
    # Primary button backgrounds
    @('bg-\[#1D3557\]', 'bg-emerald-600'),
    @('bg-\[#34A0A4\]', 'bg-emerald-600'),
    @('bg-\[#38A36D\]', 'bg-emerald-600'),
    @('bg-\[#2A401E\]', 'bg-emerald-600'),
    
    # Hover states (only if it follows a bg change or is specific to buttons)
    @('hover:bg-\[#34A0A4\]', 'hover:bg-emerald-700'),
    @('hover:bg-\[#1D3557\]', 'hover:bg-emerald-700'),
    @('hover:bg-\[#1E3016\]', 'hover:bg-emerald-700'),
    @('hover:bg-emerald-500', 'hover:bg-emerald-700'), # In case I used 500 somewhere else
    
    # Selection color (consistent with green theme)
    @('selection:bg-\[#2A401E\]', 'selection:bg-emerald-600'),
    @('selection:bg-\[#34A0A4\]', 'selection:bg-emerald-600'),

    # Shadows associated with blue theme
    @('shadow-\[0_20px_40px_rgba\(29,53,87,0\.2\)\]', 'shadow-[0_20px_40px_rgba(5,150,105,0.2)]'),
    @('shadow-\[0_15px_30px_rgba\(29,53,87,0\.2\)\]', 'shadow-[0_15px_30px_rgba(5,150,105,0.2)]'),

    # Secondary button hover borders/text
    @('hover:border-\[#34A0A4\]', 'hover:border-emerald-600'),
    @('hover:text-\[#34A0A4\]', 'hover:text-emerald-700'),
    @('text-\[#34A0A4\]', 'text-emerald-600'), # Accent text too
    
    # Bullet points/badges
    @('bg-\[#34A0A4\]\/10', 'bg-emerald-50'),
    @('text-\[#34A0A4\]', 'text-emerald-600')
)

$targetFiles = Get-ChildItem -Recurse -Include "*.tsx" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }

foreach ($file in $targetFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    foreach ($pair in $replacements) {
        $content = $content -replace $pair[0], $pair[1]
    }
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated buttons in: $($file.Name)"
    }
}
Write-Host "All buttons updated to emerald green!"
