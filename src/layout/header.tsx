import { FunctionalComponent, h, Fragment } from "preact";
import { Link } from "preact-router/match";
import { LayoutMenu } from "src/layout/menu";
import $ from "cash-dom";

export const LayoutHeader: FunctionalComponent = () => {
  const onClickMenuButton = (): void => {
    $(".header-menu").toggleClass("show");
  };
  return (
    <Fragment>
      <header class="layout-header container">
        <div class="relative">
          <button class="button-link menu-toggle" onClick={onClickMenuButton}>
            <span class="sr-only">Menu</span>
          </button>
          <h1>
            <Link href="/">insulam</Link>
          </h1>
          <div class="github">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/snellcode/insulam"
            >
              github
            </a>
          </div>
        </div>
      </header>
      <div class="header-menu">
        <LayoutMenu />
      </div>
    </Fragment>
  );
};
