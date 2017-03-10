export namespace AccountType {
  const key = 'Type';
  export enum Type{
    admin
      , team_leader
      , account_manager
  }
  export function set(v: Type) {
    console.log('set', v);
    localStorage[key] = v;
  }

  export function get(): Type {
    return +localStorage[key] || Type.admin;
  }
}
