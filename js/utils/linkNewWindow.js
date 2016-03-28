module.exports = function(e) {
  e.preventDefault();
  if (window.isElectron) {
    var extUrl = $(this).attr('href');
    if (!/^https?:\/\//i.test(extUrl)) {
      extUrl = 'http://' + extUrl;
    }
    require("shell").openExternal(extUrl);
  } else if (!e.target.hasAttribute("target")) {
    e.target.setAttribute("target", "_blank");
    e.target.click();
    return;
  }
};
