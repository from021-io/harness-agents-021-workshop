#!/usr/bin/env bash
# Preparación previa al taller: descarga todas las dependencias pesadas
# para que durante el taller no haya que esperar.
# Uso: bash scripts/preparar.sh

set -e
cd "$(dirname "$0")/.."

echo "🔎 Verificando Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "❌ No encontré Node.js. Instalalo desde https://nodejs.org (versión 24) y volvé a correr esto."
  exit 1
fi

MAJOR=$(node -e "console.log(process.versions.node.split('.')[0])")
if [ "$MAJOR" -lt 24 ]; then
  echo "❌ Tu Node.js es la versión $MAJOR y se necesita la 24 o más nueva. Actualizalo desde https://nodejs.org"
  exit 1
fi
echo "✅ Node.js $(node --version)"

for t in agente-a-agenda agente-b-noticias; do
  echo ""
  echo "📦 Preparando $t (puede tardar unos minutos)..."
  (cd "templates/$t" && npm install --no-audit --no-fund)
  echo "✅ $t listo"
done

echo ""
echo "🎉 Todo listo para el taller. Cuando empiece, abrí Claude Code acá (comando: claude) y escribí /crear-agente"
