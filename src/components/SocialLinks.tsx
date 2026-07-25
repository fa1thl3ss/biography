import { useRender } from "@base-ui-components/react/use-render";

type SocialLinkProps = {
	href: string;
	label: string;
};

function SocialLink({ href, label }: SocialLinkProps) {
	const element = useRender({
		render: <a href={href}>{label}</a>,
		props: {
			className: "social",
			target: "_blank",
			rel: "noreferrer noopener",
		},
	});

	return element;
}

export default function SocialLinks() {
	return (
		<div className="socials">
			<SocialLink href="https://github.com/fa1thl3ss" label="github" />
			<SocialLink href="https://t.me/gamesenseoffer" label="telegram" />
		</div>
	);
}
