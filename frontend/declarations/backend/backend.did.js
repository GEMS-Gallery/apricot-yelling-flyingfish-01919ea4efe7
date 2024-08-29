export const idlFactory = ({ IDL }) => {
  const Project = IDL.Record({
    'id' : IDL.Nat,
    'url' : IDL.Text,
    'title' : IDL.Text,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addProject' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getProjects' : IDL.Func([], [IDL.Vec(Project)], ['query']),
    'getProjectsByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Project)],
        ['query'],
      ),
    'searchProjects' : IDL.Func([IDL.Text], [IDL.Vec(Project)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
