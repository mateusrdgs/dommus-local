function levenshteinDistance(command, voice) {
  if(command.length == 0) return voice.length;
  if(voice.length == 0) return command.length;

  const matrix = [];

  for(let i = 0; i <= voice.length; i++){
    matrix[i] = [i];
  }

  for(let j = 0; j <= command.length; j++){
    matrix[0][j] = j;
  }

  for(let i = 1; i <= voice.length; i++){
    for(let j = 1; j <= command.length; j++){
      if(voice.charAt(i-1) === command.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                                Math.min(matrix[i][j-1] + 1,
                                         matrix[i-1][j] + 1));
      }
    }
  }

  return matrix[voice.length][command.length];
}

module.exports = levenshteinDistance;