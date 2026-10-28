const { withAppBuildGradle } = require('expo/config-plugins');

// Mantem a escolha do CMake ao regenerar android/ com Expo Prebuild.
const start = '// @generated begin cultiva-cmake';
const end = '// @generated end cultiva-cmake';

/** Recebe o conteúdo Gradle como texto, sem alterar o contrato do plugin. @param {string} contents */
function configureCmake(contents) {
  const newline = contents.includes('\r\n') ? '\r\n' : '\n';
  // Substitui somente o bloco deste plugin e a configuracao manual original.
  let result = contents.replace(/\n?\/\/ @generated begin cultiva-cmake[\s\S]*?\/\/ @generated end cultiva-cmake\r?\n?/g, '');
  result = result.replace(/^[ \t]*externalNativeBuild\s*\{\s*cmake\s*\{\s*version\s+"4\.1\.2"\s*\}\s*\}\r?\n/gm, '');
  if (!/^android\s*\{/m.test(result)) {
    throw new Error('withCmakeVersion: bloco android ausente; revisar o template Gradle.');
  }
  // O bloco separado configura a mesma extensao Android, preservando o template.
  return result.trimEnd() + newline + newline + [
    start,
    '// CMake 4.1.2: configuracao validada no Windows para caminhos longos.',
    'android {',
    '    externalNativeBuild {',
    '        cmake {',
    '            version "4.1.2"',
    '        }',
    '    }',
    '}',
    end,
    '',
  ].join(newline);
}

/** Verifica a configuração recebida pelo Expo em modo estrito. @param {Parameters<typeof withAppBuildGradle>[0]} config */
module.exports = function withCmakeVersion(config) {
  return withAppBuildGradle(config, (mod) => {
    if (mod.modResults.language !== 'groovy') {
      throw new Error('withCmakeVersion: esperado app/build.gradle em Groovy.');
    }
    mod.modResults.contents = configureCmake(mod.modResults.contents);
    return mod;
  });
};

// Exportada para verificar regeneracao e repeticao sem apagar o Android local.
module.exports.configureCmake = configureCmake;
