import { isInstall, isUninstall } from "../src/lib/parser/installation";
import install from "./mocks/installations/example.json";
import uninstall from "./mocks/uninstallations/example.json";

describe("Installation Webhooks", () => {
	test("isInstall", () => {
		expect(isInstall(install)).toBe(true);
	});

	test("isUninstall", () => {
		expect(isUninstall(install)).toBe(false);
	});
});

describe("Uninstallation Webhooks", () => {
	test("isInstall", () => {
		expect(isInstall(uninstall)).toBe(false);
	});

	test("isUninstall", () => {
		expect(isUninstall(uninstall)).toBe(true);
	});
});