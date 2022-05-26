import { describe, test, expect } from "vitest";
import { getInstallationId } from "../src/webhook";

import installPayload from "./mocks/installations/example.json";
import uninstallPayload from "./mocks/uninstallations/example.json";
import issueAlertPayload from "./mocks/issue-alert/example.json";
import issuePayload from "./mocks/issues/example.json";
import metricAlertPayload from "./mocks/metric-alert/example.json";

describe("Webhook Parser", () => {
	describe("getInstallationId", () => {
		test("Install Payload", () => {
			expect(getInstallationId(installPayload)).toBe(
				"a8e5d37a-696c-4c54-adb5-b3f28d64c7de"
			);
		});

		test("Uninstall Payload", () => {
			expect(getInstallationId(uninstallPayload)).toBe(
				"a8e5d37a-696c-4c54-adb5-b3f28d64c7de"
			);
		});

		test("Issue Alert Payload", () => {
			expect(getInstallationId(issueAlertPayload)).toBe(
				"a8e5d37a-696c-4c54-adb5-b3f28d64c7de"
			);
		});

		test("Issue Payload", () => {
			expect(getInstallationId(issuePayload)).toBe(
				"a8e5d37a-696c-4c54-adb5-b3f28d64c7de"
			);
		});

		test("Metric Alert Payload", () => {
			expect(getInstallationId(metricAlertPayload)).toBe(
				"a8e5d37a-696c-4c54-adb5-b3f28d64c7de"
			);
		});
	});
});
