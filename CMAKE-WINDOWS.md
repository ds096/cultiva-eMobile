# CMake no Windows — cultiva-ev2

Configuracao registrada em 20/10/2026 para Expo 58.0.16, React Native 0.88.0 e Reanimated 4.7.1, mantendo o projeto em C:\Users\ssdan\Documents\cultiva-ev2.

## Como a configuracao persiste

- `plugins/withCmakeVersion.js`, registrado em `app.json`, configura CMake 4.1.2 no aplicativo a cada Prebuild. Remove o bloco manual original e evita duplicar seu proprio bloco.
- `patches/react-native-reanimated+4.7.1.patch` configura a mesma versao no Reanimated. O script `postinstall` executa `patch-package --error-on-fail` depois da instalacao npm, interrompendo a instalacao se o patch nao puder ser aplicado.
- `package-lock.json` deve acompanhar essas alteracoes no Git. O Reanimated 4.7.1 esta atualmente resolvido como dependencia transitiva/peer no lockfile.
- CMake 4.1.2 precisa estar instalado no SDK Android da maquina. O plugin seleciona a versao; nao instala o SDK. Nesta maquina ele existe em `%LOCALAPPDATA%\Android\Sdk\cmake\4.1.2`.

## Uso cotidiano

Execute os comandos na raiz do projeto:

```powershell
# Reinstala as versoes do lockfile e executa o postinstall.
npm ci

# Aplica os plugins preservando os demais arquivos Android existentes.
npx expo prebuild --platform android --no-install --no-clean

# Compila e executa o aplicativo.
npm run android
```

No SDK 58 instalado, Prebuild sem `--no-clean` recria a pasta nativa. Na primeira verificacao desta atividade, a pasta Android foi regenerada; a configuracao 4.1.2 foi restaurada pelo plugin. Na segunda, usamos `--no-clean` e verificamos a repeticao sem duplicacao.

Nao usar `--ignore-scripts` na instalacao normal: ele pula o postinstall. O ambiente de build precisa incluir as dependencias de desenvolvimento, onde esta patch-package. Se os scripts foram pulados intencionalmente, executar `npm run postinstall` antes de compilar.

Ao atualizar Reanimated, Expo ou React Native, revisar a necessidade do pin e do patch e recompilar. Nao apenas renomear o patch para outra versao. Para voltar a escolha padrao, retirar o plugin de app.json e o patch, reinstalar as dependencias e regenerar Android, depois validar o build.

## Verificacoes

- Plugin: entrada sem configuracao CMake, migracao do bloco manual, LF/CRLF, repeticao sem duplicacao e erro para template sem bloco android.
- Prebuild: regeneracao completa e aplicacao subsequente sem limpeza, com uma unica configuracao CMake 4.1.2.
- Patch: aplicado duas vezes com sucesso ao arquivo Gradle original extraido do pacote publicado 4.7.1 em uma pasta de verificacao isolada.
- Lint, TypeScript, `expo install --check`, `npm ls --depth=0` e `git diff --check`: aprovados.
- Caches de CMake confirmam executaveis CMake/Ninja de 4.1.2 no aplicativo e no Reanimated.
- Nao foi executado `npm ci` sobre toda a arvore local. O teste isolado verifica a reaplicacao no arquivo original sem apagar todas as dependencias.

Referencias: https://docs.expo.dev/config-plugins/mods/ e https://github.com/ds300/patch-package.

Resultado final em 20/10/2026:

- `app:assembleDebug` para arm64-v8a: BUILD SUCCESSFUL em 5m 9s, no diretorio original. APK gerado em `android/app/build/outputs/apk/debug/app-debug.apk`. Nao instalado nem testado no celular nesta atividade; release e outras arquiteturas nao foram validados.
- Persistencia local: conferido que a unica diferenca do Gradle do Reanimated era o pin manual, restaurado somente esse arquivo a partir do pacote original e executado `npm run postinstall` duas vezes. Ambas passaram; CMake 4.1.2 restaurado sem duplicacao.
- Avisos de depreciacao do Gradle/AGP e CMake continuam presentes, sem impedir este build. Isso nao comprova compatibilidade futura com Gradle 10.
- A instalacao de patch-package reportou 28 alertas npm (7 moderados, 21 altos); nao foi aplicada correcao automatica de dependencias fora deste escopo.
