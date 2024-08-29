import Bool "mo:base/Bool";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

actor {
  type Project = {
    id: Nat;
    title: Text;
    category: Text;
    url: Text;
  };

  stable var nextId: Nat = 0;
  stable var projectsEntries: [(Nat, Project)] = [];

  let projects = HashMap.fromIter<Nat, Project>(projectsEntries.vals(), 0, Nat.equal, Hash.hash);

  public func addProject(title: Text, category: Text, url: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let project: Project = {
      id;
      title;
      category;
      url;
    };
    projects.put(id, project);
    id
  };

  public query func getProjects() : async [Project] {
    Iter.toArray(projects.vals())
  };

  public query func getProjectsByCategory(category: Text) : async [Project] {
    Array.filter<Project>(Iter.toArray(projects.vals()), func (p: Project) : Bool {
      Text.equal(p.category, category)
    })
  };

  public query func searchProjects(searchQuery: Text) : async [Project] {
    let lowercaseQuery = Text.toLowercase(searchQuery);
    Array.filter<Project>(Iter.toArray(projects.vals()), func (p: Project) : Bool {
      Text.contains(Text.toLowercase(p.title), #text lowercaseQuery) or
      Text.contains(Text.toLowercase(p.category), #text lowercaseQuery)
    })
  };

  system func preupgrade() {
    projectsEntries := Iter.toArray(projects.entries());
  };

  system func postupgrade() {
    projectsEntries := [];
  };
}
