const credentialsAreMissing = args => ['user', 'password'].some(k => !args[k]);

export default credentialsAreMissing;
