import React from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { PopupApp, PopupAppProps } from "./PopupApp";
import { DebugPopupMessanger } from "./PopupMessenger";
import { DebugPopupTabManager } from "./PopupTabManager";
import { chakraDecorator } from "./utils/ChakraDecorator";

const meta: ComponentMeta<typeof PopupApp> = {
  title: "Popup/Debugger",
  decorators: [chakraDecorator],
  args: {
    messenger: new DebugPopupMessanger(),
    tabManager: new DebugPopupTabManager(),
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const Template: Story<PopupAppProps> = (args) => <PopupApp {...args} />;

export const Enabled = Template.bind({});

export const DisabledDomain = Template.bind({});
DisabledDomain.args = {
  messenger: new DebugPopupMessanger(),
};

export const DisabledPage = Template.bind({});
DisabledPage.args = {
  messenger: new DebugPopupMessanger(),
};
