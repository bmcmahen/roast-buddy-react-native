export function skipIntro() {
  return {
    type: "SKIP_INTRO"
  };
}

export function showIntro() {
  return {
    type: "SHOW_INTRO"
  };
}

export function hideLoginHint() {
  return {
    type: "HIDE_LOGIN_HINT"
  };
}
