import React from "react";

import { mount } from "enzyme";

import toDiffableHtml from "diffable-html";

import { AlertStore } from "Stores/AlertStore";
import { Settings } from "Stores/Settings";
import { MainModalContent } from "./MainModalContent";

let alertStore;
let settingsStore;
const onHide = jest.fn();

beforeEach(() => {
  alertStore = new AlertStore([]);
  settingsStore = new Settings();
  onHide.mockClear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const FakeModal = () => {
  return mount(
    <MainModalContent
      alertStore={alertStore}
      settingsStore={settingsStore}
      onHide={onHide}
    />
  );
};

const ValidateSetTab = (title, callArg) => {
  const component = FakeModal();
  const instance = component.instance();
  const setTabSpy = jest.spyOn(instance.tab, "setTab");

  const tab = component.find({ title: title });
  tab.simulate("click");
  expect(setTabSpy).toHaveBeenCalledWith(callArg);
  expect(component.find(".nav-link.active").text()).toBe(title);
};

describe("<MainModalContent />", () => {
  it("matches snapshot", () => {
    // we have multiple fragments and enzyme only renders the first one
    // in html() and text(), debug() would work but it's noisy
    // https://github.com/airbnb/enzyme/issues/1213
    const tree = mount(
      <span>
        <MainModalContent
          alertStore={alertStore}
          settingsStore={settingsStore}
          onHide={onHide}
        />
      </span>
    );
    expect(toDiffableHtml(tree.html())).toMatchSnapshot();
  });

  it("shows 'Configuration' tab by default", () => {
    const tree = FakeModal();
    const activeTab = tree.find(".nav-link.active");
    expect(activeTab.text()).toBe("Configuration");
  });

  // modal makes it tricky to verify re-rendered content, so only check if we
  // update the store for now
  it("calls setTab('configuration') after clicking on the 'Configuration' tab", () => {
    ValidateSetTab("Configuration", "configuration");
  });

  it("calls setTab('help') after clicking on the 'Help' tab", () => {
    ValidateSetTab("Help", "help");
  });
});
