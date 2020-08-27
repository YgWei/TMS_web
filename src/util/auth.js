import store from "../store";

// export function getCurrentAuthority() {
//   return ["gitlab"];
// }

export function authName() {
  const name = store.getters.getRoles;
  let rolesInfo = [];
  name.forEach(value => {
    value.group.forEach(element => {
      rolesInfo.push(element);
    });
  });
  return rolesInfo;
}

export function check(authority) {
  const current = authName();
  for (let item of current) {
    let isFind = authority.includes(item);
    if (isFind) return isFind;
  }
  return false;
}
