{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = with pkgs; [ 
    git
    gh
    nodejs
    nodePackages_latest.pnpm
    openssl
    curl
    jq 
  ];
}
