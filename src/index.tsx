import { FunctionalComponent, h } from "preact";
import { RecoilRoot } from "recoil";
import { isTargetList } from "src/services/util";
import { LayoutHeader } from "src/layout/header";
import { LayoutFooter } from "src/layout/footer";
import { LayoutMain } from "src/layout/main";
import $ from "cash-dom";
import "style/index.scss";

const Index: FunctionalComponent = () => {
  const onClickLayout = (event: Event): void => {
    if (isTargetList(event.target, [".menu-toggle", ".header-menu a"])) {
      return;
    }
    $(".header-menu").removeClass("show");
  };
  return (
    <div id="preact_root" class="layout" onClick={onClickLayout}>
      <RecoilRoot>
        <LayoutHeader />
        <LayoutMain />
        <LayoutFooter />
      </RecoilRoot>
    </div>
  );
};

export default Index;
