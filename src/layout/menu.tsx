import { FunctionalComponent, h } from "preact";
import { useEffect } from "preact/hooks";
import { useRecoilState } from "recoil";
import { Link } from "preact-router/match";
import { routeState } from "src/services/state";
import $ from "cash-dom";

export const LayoutMenu: FunctionalComponent = () => {
  const [route, setRoute] = useRecoilState(routeState);

  const onClickMenuItem = () => {
    $(".header-menu").removeClass("show");
    setRoute(`${route.split(":").shift()}:${Date.now()}`);
  };

  // avoid unstyled (fouc)
  const initEffect = () => {
    $(() => $(".header-menu").addClass("animate"));
  };

  useEffect(initEffect, []);

  const links = [
    ["Home", "/"],
    ["About", "/about"],
  ];

  return (
    <nav class="menu">
      <ul>
        {links.map((link) => (
          <li key={link[1]}>
            <Link
              href={link[1]}
              activeClassName="active"
              onClick={onClickMenuItem}
            >
              <span>{link[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
