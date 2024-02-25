import { SchedulerViewSlot } from "@progress/kendo-react-scheduler";
export const CustomViewSlot = (props) => {
  return (
    <SchedulerViewSlot
      {...props}
      style={{
        ...props.style,
      }}
    />
  );
};
