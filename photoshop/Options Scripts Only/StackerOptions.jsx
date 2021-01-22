var StackerOptions = {};

StackerOptions.init = function(obj) {
  if (!obj) obj = {};
  else obj = JsonUtil.parseJson(obj);
  function getBlendMode() {
    switch (obj.blendMode) {
      case 8: return BlendMode.LIGHTEN;
      case 4: return BlendMode.DARKEN;
      case 2: return BlendMode.NORMAL;
    }
    return BlendMode.DARKEN;
  }
  var options = {
    blendMode: getBlendMode(),
    effect: obj.effect || "commet",
    stackLength: obj.stackLength || 32,
    stackGrowth: obj.stackGrowth || null,
    autoAlign: obj.autoAlign || false,
    action: obj.action || null,
    displacement: obj.displacement || 1,
    video: obj.video || "1080@24",
    delayLength: obj.delayLength || 0,
    growEvery: obj.growEvery === 0 ? 0 : (obj.growEvery || 1),
    stackOnce: obj.stackOnce
  };
  StackerOptions.options = options;
  return options;
}

StackerOptions.getOptions = function (cb) {
  StackerOptions.init();

  var window = new Window('dialog', 'Stacker Options');

  function renderRadioButton(element, key, label, value) {
    var radio = element.add("radiobutton", undefined, label);
    radio.alignment = "left";
    radio.value = StackerOptions.options[key] == value;
    radio.onClick = function() {
      StackerOptions.options[key] = value;
    }
  }

  function renderPanel(title, width, height) {
    var panel = window.add("panel", undefined, title, { borderStyle: "r" });
    panel.orientation = "column";
    panel.alignment = 'left';
    panel.preferredSize = [width || 200, height || 40];
    panel.spacing = 0;
    return panel;
  }

  function renderGroup(element) {
    var group = element.add('group');
    group.orientation = 'row';
    group.alignment="left";
    return group;
  }

  function renderActionOptions() {
    var panel = renderPanel("Run Stacker Action:");
    var group = renderGroup(panel);
    var key = "action";
    renderRadioButton(group, key, 'Action', 'Action');
    renderRadioButton(group, key, 'none', null);
  }

  function renderBlendModeOptions() {
    var panel = renderPanel("Select Blend Mode:", 200, 60);
    var group = renderGroup(panel);
    var key = "blendMode";
    renderRadioButton(panel, key, 'Lighten', BlendMode.LIGHTEN);
    renderRadioButton(panel, key, 'Darken', BlendMode.DARKEN);
    renderRadioButton(panel, key, 'Screen', BlendMode.SCREEN);
    renderRadioButton(panel, key, 'Normal', BlendMode.NORMAL);
  }

  function renderEffectOptions() {
    var panel = renderPanel("Select Effect:");
    var group = renderGroup(panel);
    var key = "effect";
    renderRadioButton(group, key, 'Commet', 'commet');
    renderRadioButton(group, key, 'Reverse Commet', 'reverseCommet');
    renderRadioButton(group, key, 'Normal', 'normal');
  }

  function renderStackLengthOptions() {
    var panel = renderPanel("Select Stack Length:");
    var group = renderGroup(panel);
    var key = "stackLength";
    var stackSizes = [1, 4, 8, 16, 32, 64, 128, 256];
    for (var i in stackSizes) {
      var stackSize = stackSizes[i];
      renderRadioButton(group, key, '' + stackSize, stackSize);
    }
  }

  function renderStackGrowthOptions() {
    var panel = renderPanel("Show Stack Growth:");
    var group = renderGroup(panel);
    var key = "stackGrowth";
    renderRadioButton(group, key, 'growth only', 1);
    renderRadioButton(group, key, 'decay only', 2);
    renderRadioButton(group, key, 'growth and decay', 3);
    renderRadioButton(group, key, 'none', null);
  }

  function renderAutoAlignOptions() {
    var panel = renderPanel("Auto Align Images:");
    var group = renderGroup(panel);
    var key = "autoAlign";
    renderRadioButton(group, key, 'on', true);
    renderRadioButton(group, key, 'off', false);
  }

  function renderDisplacementOptions() {
    var panel = renderPanel("Displacement Between Frames:");
    var group = renderGroup(panel);
    var key = "displacement";
    var displacements = [1, 2, 4, 8, 16, 32];
    for (var i in displacements) {
      var displacement = displacements[i];
      renderRadioButton(group, key, '' + displacement, displacement);
    }
  }

  function renderVideoOptions() {
    var panel = renderPanel("Export Video:");
    var group = renderGroup(panel);
    var key = "video";
    renderRadioButton(group, key, 'none', null);
    renderRadioButton(group, key, '720p @24fps', '720@24');
    renderRadioButton(group, key, '720p @30fps', '720@30');
    renderRadioButton(group, key, '720p @60fps', '720@60');
    renderRadioButton(group, key, '1080p @24fps', '1080@24');
    renderRadioButton(group, key, '1080p @30fps', '1080@30');
    renderRadioButton(group, key, '1080p @60fps', '1080@60');
    renderRadioButton(group, key, '2304p @24fps', '2304@24');
  }

  function renderSubmitButtons() {
    var group = window.add('group');
    var btn = group.add('button',undefined,"Process");
    btn.bounds = [10,80,190,101];
    btn.onClick = function() {
      window.close(1);
      cb(StackerOptions.options);
    };

    btn = group.add('button',undefined,"Cancel");
    btn.bounds = [210,80,390,101];
    btn.onClick = function() {
      window.close(1);
    };
  }

  renderBlendModeOptions();
  renderEffectOptions();
  renderStackLengthOptions();
  renderStackGrowthOptions()
  renderAutoAlignOptions();
  renderDisplacementOptions();
  renderActionOptions();
  renderVideoOptions();
  renderSubmitButtons();
  window.show();
}
