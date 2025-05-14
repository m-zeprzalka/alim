# Skrypt do inicjalizacji repozytorium Git i pushowania kodu
# Użycie: ./init-git.ps1 "nazwa-repozytorium" "opis-repozytorium"

param(
    [Parameter(Mandatory=$true)]
    [string]$repoName,
    
    [Parameter(Mandatory=$false)]
    [string]$description = "AliMatrix - Aplikacja wspomagająca ustalanie alimentów w Polsce"
)

Write-Host "Inicjalizacja repozytorium Git dla AliMatrix..." -ForegroundColor Green

# Sprawdź, czy git jest zainstalowany
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git nie jest zainstalowany. Zainstaluj Git i spróbuj ponownie." -ForegroundColor Red
    exit 1
}

# Sprawdź, czy folder .git już istnieje
if (Test-Path .git) {
    $confirmation = Read-Host "Repozytorium Git już istnieje. Czy chcesz je zresetować? (t/n)"
    if ($confirmation -eq 't') {
        Remove-Item -Recurse -Force .git
        Write-Host "Usunięto istniejące repozytorium Git." -ForegroundColor Yellow
    } else {
        Write-Host "Używanie istniejącego repozytorium Git." -ForegroundColor Yellow
    }
}

# Inicjalizacja repozytorium
if (-not (Test-Path .git)) {
    git init
    Write-Host "Zainicjowano nowe repozytorium Git." -ForegroundColor Green
}

# Dodaj pliki
git add .

# Sprawdź, czy są jakieś zmiany do zcommitowania
$status = git status --porcelain
if ($status) {
    # Wykonaj pierwszy commit
    git commit -m "Initial commit: AliMatrix demo version"
    Write-Host "Wykonano pierwszy commit." -ForegroundColor Green
} else {
    Write-Host "Brak zmian do zcommitowania." -ForegroundColor Yellow
}

# Podłączanie do GitHub (opcjonalne)
$connectToGitHub = Read-Host "Czy chcesz podłączyć do repozytorium na GitHub? (t/n)"
if ($connectToGitHub -eq 't') {
    $githubUsername = Read-Host "Podaj swoją nazwę użytkownika GitHub"
    
    # Tworzenie repozytorium na GitHub (wymaga gh CLI)
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        $createRepo = Read-Host "Czy chcesz utworzyć nowe repozytorium na GitHub? (t/n)"
        if ($createRepo -eq 't') {
            Write-Host "Tworzenie repozytorium $repoName na GitHub..." -ForegroundColor Green
            gh repo create $repoName --public --description $description --source=. --push
        } else {
            # Dodaj zdalne repozytorium
            git remote add origin "https://github.com/$githubUsername/$repoName.git"
            
            # Push do GitHub
            git push -u origin main
        }
        
        Write-Host "Kod został wypchnięty do GitHub!" -ForegroundColor Green
    } else {
        Write-Host "GitHub CLI (gh) nie jest zainstalowane. Wykonaj ręczny push do GitHub." -ForegroundColor Yellow
        Write-Host "Komenda do wykonania po utworzeniu repozytorium:" -ForegroundColor Yellow
        Write-Host "git remote add origin https://github.com/$githubUsername/$repoName.git" -ForegroundColor Cyan
        Write-Host "git push -u origin main" -ForegroundColor Cyan
    }
}

Write-Host "Gotowe! Repozytorium zostało zainicjalizowane." -ForegroundColor Green
