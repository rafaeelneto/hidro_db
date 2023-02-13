const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const gql = require('graphql-tag');

const gqlClient = require('../graph-client/client');
const AppError = require('../utils/appError');

const fragments = {
  userId: {
    query: gql`
      fragment userId on users {
        id
      }
    `,
    name: 'userId',
  },
  userLogin: {
    query: gql`
      fragment userLogin on users {
        nome
        email
        scope
        userRoles {
          nome
        }
      }
    `,
    name: 'userLogin',
  },
  userCheckToken: {
    query: gql`
      fragment userCheckToken on users {
        id
        psw_changed_at
      }
    `,
    name: 'userCheckToken',
  },
  userRefreshToken: {
    query: gql`
      fragment userRefreshToken on users {
        id
        psw_changed_at
        refresh_token
        nome
        email
        scope
        userRoles {
          nome
        }
      }
    `,
    name: 'userRefreshToken',
  },
};

exports.fragments = fragments;

const queriesOperations = {
  userIDByLogin: (login_name) => ({
    query: gql`
      query($login_name: String) {
        users(where: { login_name: { _eq: $login_name } }) {
          ...userId
        }
      }
      ${fragments.userId.query}
    `,
    variables: {
      login_name,
    },
  }),
  userIdByEmail: (email) => ({
    query: gql`
      query($email: String) {
        users(where: { email: { _eq: $email } }) {
          ...userId
        }
      }
      ${fragments.userId.query}
    `,
    variables: {
      email,
    },
  }),
  userIdByDrt: (drt) => ({
    query: gql`
      query($drt: String) {
        users(where: { drt: { _eq: $drt } }) {
          ...userId
        }
      }
      ${fragments.userId.query}
    `,
    variables: {
      drt,
    },
  }),
  userIdByResetToken: (resetToken) => ({
    query: gql`
      query($resetToken: String) {
        users(where: { reset_token: { _eq: $resetToken } }) {
          ...userId
          reset_expires
        }
      }
      ${fragments.userId.query}
    `,
    variables: {
      resetToken,
    },
  }),
  userByID: (id, fragment) => ({
    query: gql`
    query($id: uuid) {
      users(where: { id: { _eq: $id } }) {
        ...${fragment.name}
      }
    }
    ${fragment.query}
    `,
    variables: {
      id,
    },
  }),
};

const mutationsOperations = {
  newUser: (user) => ({
    object: {
      query: gql`
        mutation createUser($user: users_insert_input!) {
          insert_users_one(object: $user) {
            id
            nome
            email
          }
        }
      `,
      variables: {
        user,
      },
    },
    name: 'insert_users_one',
  }),
  setRefreshToken: (id, token) => ({
    object: {
      query: gql`
        mutation setRefreshToken(
          $user: users_set_input!
          $pk: users_pk_columns_input!
        ) {
          update_users_by_pk(_set: $user, pk_columns: $pk) {
            refresh_token
          }
        }
      `,
      variables: {
        user: {
          refresh_token: `${token}`,
        },
        pk: {
          id: `${id}`,
        },
      },
    },
    name: 'update_users_by_pk',
  }),
  setResetToken: (id, reset_token, reset_expires) => ({
    object: {
      query: gql`
        mutation setResetToken(
          $user: users_set_input!
          $pk: users_pk_columns_input!
        ) {
          update_users_by_pk(_set: $user, pk_columns: $pk) {
            id
            email
            nome
          }
        }
      `,
      variables: {
        user: {
          reset_token,
          reset_expires,
        },
        pk: {
          id,
        },
      },
    },
    name: 'update_users_by_pk',
  }),
  changePassword: (id, psw) => ({
    object: {
      query: gql`
        mutation setResetToken(
          $user: users_set_input!
          $pk: users_pk_columns_input!
        ) {
          update_users_by_pk(_set: $user, pk_columns: $pk) {
            id
          }
        }
      `,
      variables: {
        user: {
          psw,
          psw_changed_at: new Date().toISOString(),
        },
        pk: {
          id,
        },
      },
    },
    name: 'update_users_by_pk',
  }),
};

const getUserData = async (operation) => {
  //Simple user information role is set to default admin-secret
  operation = {
    ...operation,
    context: {
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_SECRET_KEY,
      },
    },
  };

  const response = await gqlClient.query(operation);

  if (response.errors) {
    return response;
  }

  return response.users[0];
};

const setUserData = async (operation) => {
  // Simple user information role is set to default admin-secret
  // Creation and insertion is made only by autheticanted users and uses the users the token to request the graphQL engine
  operation.object = {
    ...operation.object,
    context: {
      headers: {
        'X-Hasura-Admin-Secret': process.env.HASURA_SECRET_KEY,
      },
    },
  };

  const data = await gqlClient.query(operation.object);

  if (data.errors) {
    return data;
  }

  return data[operation.name];
};

const setUserDataAuth = async (operation, token) => {
  //Creation and insertion is made only by autheticanted users and uses the users the token to request the graphQL engine
  operation.object = {
    ...operation.object,
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  const data = await gqlClient.query(operation.object);

  if (data.errors) {
    return data;
  }

  return data[operation.name];
};

exports.getUserIDByResetToken = async (token) => {
  const operation = queriesOperations.userIdByResetToken(token);

  const user = await getUserData(operation);

  if (!user || user.errors) throw new AppError('Incorrect login data', 401);

  if (new Date(user.reset_expires) < Date.now())
    throw new AppError('Token invalid or expired', 400);

  return user.id;
};

exports.getUserIDBy = async (login_name, email, drt) => {
  let operation;

  if (login_name) {
    operation = queriesOperations.userIDByLogin(login_name);
  } else if (email) {
    operation = queriesOperations.userIdByEmail(email);
  } else if (drt) {
    operation = queriesOperations.userIdByDrt(drt);
  }

  const user = await getUserData(operation);

  if (!user || user.errors) throw new AppError('Incorrect login data', 401);

  return user.id;
};

exports.getUserByID = async (id, fragment) => {
  const user = await getUserData(queriesOperations.userByID(id, fragment));

  if (!user || user.errors) throw new AppError("User doesn' exist", 404);

  // ? FEATURE MAY BE ADDED IN THE FUTURE
  // if (user.userOnRoles) {
  //   user.roles = user.userOnRoles.map((item) => item.role.nome);
  // }

  if (user.userRoles) {
    user.role = user.userRoles.nome;
  }

  return user;
};

exports.verifyPassword = async (id, password) => {
  const operation = {
    query: gql`
      query($id: uuid) {
        users(where: { id: { _eq: $id } }) {
          psw
        }
      }
    `,
    variables: {
      id,
    },
  };

  const user = await getUserData(operation);

  if (!user || user.errors) throw new AppError("User doesn' exist", 404);

  return await bcrypt.compare(password, user.psw);
};

exports.createUser = async (created_by, newUser, token) => {
  if (newUser.psw !== newUser.pswConfirm) {
    throw new AppError('Passwords are not the same', 400);
  }
  newUser.psw = await bcrypt.hash(newUser.psw, 12);
  newUser.created_by = created_by;
  // ? FEATURE MAY BE ADDED IN THE FUTURE
  // newUser.userOnRoles = {
  //   data: newUser.roles.map((id) => {
  //     return {
  //       role_id: id,
  //     };
  //   }),
  // };
  delete newUser.roles;
  delete newUser.pswConfirm;

  const operation = mutationsOperations.newUser(newUser);

  const user = await setUserDataAuth(operation, token);

  if (!user || user.errors) {
    return user;
  }

  return user;
};

exports.saveRefreshToken = async (id, refreshToken, authToken) => {
  const operation = mutationsOperations.setRefreshToken(id, refreshToken);

  const result = await setUserDataAuth(operation, authToken);

  if (!result || result.errors) {
    throw new AppError('Error on generate token', 500);
  }

  return result.refresh_token;
};

exports.deleteRefreshToken = async (id, authToken) => {
  const operation = mutationsOperations.setRefreshToken(id, '');

  const result = await setUserDataAuth(operation, authToken);
  if (!result || result.errors) {
    console.log(result.errors);
    throw new AppError('Error on generate token', 500);
  }

  return result;
};

exports.saveResetToken = async (id) => {
  const resetToken = crypto.randomBytes(36).toString('hex');

  const cryptedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const operation = mutationsOperations.setResetToken(
    id,
    cryptedResetToken,
    tokenExpiresAt
  );

  const result = await setUserData(operation);

  if (!result || result.errors) {
    console.log(result.errors);
    throw new AppError('Error on generate token', 500);
  }

  const { nome, email } = result;

  return { resetToken, nome, email };
};

exports.deleteResetToken = async (id) => {
  const operation = mutationsOperations.setResetToken(id, null, null);

  const result = await setUserData(operation);
  if (!result || result.errors)
    throw new AppError('Error on generate token', 500);

  return result;
};

exports.changePassword = async (id, psw) => {
  const hashedPsw = await bcrypt.hash(psw, 12);
  const operation = mutationsOperations.changePassword(id, hashedPsw);

  const user = await setUserData(operation);

  if (!user || user.errors)
    throw new AppError('Error on changing password', 500);

  return user.id;
};
