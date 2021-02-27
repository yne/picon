name: "esyscmd(basename -z $PWD)"
designer: "esyscmd(git log -1 --pretty=format:'%an')"
license: "OFL"
category: "MONOSPACE"
date_added: "2012-09-30"
define(`foreach', `pushdef(`$1')_foreach($@)popdef(`$1')')dnl
define(`_arg1', `$1')dnl
define(`_foreach', `ifelse(`$2', `()', `', `define(`$1', _arg1$2)$3`'$0(`$1', (shift$2), `$3')')')dnl
foreach(`JSON', JSONS, `fonts {
  name: esyscmd(jq .familyName < JSON)dnl
  style: esyscmd(jq .styleName < JSON)dnl
  weight: esyscmd(jq .weightClass < JSON)dnl
  filename: esyscmd(jq .filename < JSON)dnl
  full_name: esyscmd(jq .fullName < JSON)dnl
  copyright: esyscmd(jq .copyright < JSON)dnl
  post_script_name: esyscmd(jq .postScriptName < JSON)dnl
}
')
subsets: "latin"
subsets: "menu"
