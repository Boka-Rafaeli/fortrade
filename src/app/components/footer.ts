import { Page } from "@playwright/test";
import { Button } from "../../core/browser-elements";

export class FooterComponent{
    private readonly menuBtn: Button;
    constructor(private page: Page) {
       
        this.menuBtn = new Button(
            page, undefined, '[data-cmd="menu"]'
        );
    }

    async clickMenuBtn(): Promise<void> {
        await this.menuBtn.shouldBeVisible({timeout: 10_000});
        await this.menuBtn.click();
    }
}

