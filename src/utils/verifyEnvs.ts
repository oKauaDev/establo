const envs = ["AWS_REGION"];

const notfound: string[] = [];

for (const env of envs) {
  if (!process.env[env]) {
    notfound.push(env);
  }
}

if (notfound.length > 0) {
  throw new Error(`As seguintes variáveis de ambiente não foram definidas: ${notfound.join(", ")}`);
}
