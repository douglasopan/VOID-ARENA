# Void Arena Engine Guardrails

Estas regras protegem sistemas que ja estao funcionando. Antes de alterar qualquer item abaixo, a mudanca precisa vir com teste de geracao, typecheck e build.

## Geracao do mapa

- Nao remover a validacao final de `ProceduralMapGenerator.finalizeObjectPlacement`.
- Nenhum objeto pode nascer sobre outro objeto, faixa de pedestre, ou rota de pedestre.
- Predios usam footprint maior que a caixa visivel, calculado pelo raio diagonal, para evitar cantos entrando em outros predios.
- Pessoas podem andar por rotas de pedestre; props de calcada devem sair do caminho, nao o contrario.
- Semaforos e faixas de pedestre sao infraestrutura protegida. Se algo colidir com eles, o objeto deve ser removido ou reposicionado.

## Fisica do void

- O void nao deve empurrar objetos por contato normal de borda.
- Objetos so comecam a cair quando uma parte suficiente do footprint esta dentro da abertura.
- Ao iniciar queda, o objeto deve cair para baixo primeiro; centralizacao horizontal so pode ocorrer depois de estar abaixo da superficie.
- O powerup `gust` e a excecao controlada para empurrar itens.

## Altura dos props

- Todo prop deve ficar acima do mapa. O ajuste manual fica em `generation.spawnHeightOffsets`.
- A correcao visual no carregamento da cena nao substitui o ajuste correto no editor; ela e uma protecao contra pivots/modelos ruins.

## UI e audio

- Textos visiveis devem passar pelo i18n/overrides, nao ficar hardcoded em um unico idioma.
- Audio final do jogo deve usar `.ogg`; `.mp3` deve ser convertido pelo painel/admin antes de entrar no build.

## Checklist obrigatorio

- `npm run typecheck`
- `npm run build`
- Validar uma amostra procedural com seeds diferentes para confirmar zero overlap critico.
