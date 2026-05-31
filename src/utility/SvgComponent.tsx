import {SVGProps, CSSProperties, FC} from "react";

type SvgComponentType = {
    icon: FC<SVGProps<SVGSVGElement>> | string,
    width: number
    height: number
    color?: string
    style?: CSSProperties;
}
const SvgComponent = ({icon, color = '#E5EAF2', width, height, style}: SvgComponentType) => {

        const YourSvg = icon;
        return (
            <YourSvg
                style={{ height, width, color, ...style }}
                color={color}
                width={width}
                height={height}
            />
        );

}

export default SvgComponent