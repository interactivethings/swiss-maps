{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    nix-develop.url = "github:nicknovitski/nix-develop";
    nix-develop.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    {
      nixpkgs,
      nix-develop,
      ...
    }:
    let
      forAllSystems =
        function: nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (system: function nixpkgs.legacyPackages.${system});

    in
    {
      packages = forAllSystems (pkgs: {
        nix-develop = nix-develop.packages.${pkgs.stdenv.system}.default;
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.biome
            pkgs.nodejs
            pkgs.pnpm
          ];
        };

        workflow = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.biome
          ];
        };
      });
    };
}
