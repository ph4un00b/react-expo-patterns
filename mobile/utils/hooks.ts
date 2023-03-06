import { useEffect, useRef } from "react";

export function useLogRenders(name: string) {
	const rerender = useRef(0);
	useEffect(() => {
		rerender.current += 1;
		console.log(`${name}: `, rerender.current);
	});
}
