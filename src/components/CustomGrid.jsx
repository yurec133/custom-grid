import React from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { DragAndDrop, Droppable } from "@progress/kendo-react-common";
import {
  Scheduler,
  WeekView,
  MonthView,
  SchedulerItem,
} from "@progress/kendo-react-scheduler";
import { guid } from "@progress/kendo-react-common";
import { DragHandleCell } from "./DragHandleCell.jsx";
import { DraggableRow } from "./DraggableRow.jsx";
import gridData from "../data.js";

export const ReorderContext = React.createContext({
  dragStart: () => {},
});

const schedulerCellClass = "k-scheduler-cell k-slot-cell k-nonwork-hour";
const allClassSlotCell = "." + schedulerCellClass.replace(/ /g, ".");

const updateTargetBackground = (target, color) => {
  if (target.className === schedulerCellClass) {
    target.style.background = color;
  }
};
const CustomItem = (props) => {
  const {
    // eslint-disable-next-line react/prop-types
    dataItem: { title, length },
  } = props;
  return (
    <SchedulerItem {...props}>
      {title} {length}
    </SchedulerItem>
  );
};

const CustomGrid = () => {
  const MyScheduler = React.useRef();
  const MyDroppable = React.useRef();
  const [activeItem, setActiveItem] = React.useState(null);
  const [data, setData] = React.useState([]);

  const handleDragOver = (e) => {
    const schedulerElement = MyDroppable.current.element;
    const target = document.elementFromPoint(e.event.clientX, e.event.clientY);
    const allElements = schedulerElement.querySelectorAll(allClassSlotCell);
    allElements.forEach((element) => {
      updateTargetBackground(element, "");
    });
    updateTargetBackground(target, "rgba(255, 124, 115, 0.5)");
  };
  const handleDropItem = (e) => {
    if (!activeItem) {
      return;
    }
    const target = document.elementFromPoint(e.event.clientX, e.event.clientY);
    updateTargetBackground(target, "");
    const start = target.getAttribute("data-slot-start");
    const end = target.getAttribute("data-slot-end");
    const startDate = new Date(parseInt(start));
    const endDate = new Date(parseInt(end));
    const newEvent = {
      id: guid(),
      title: activeItem.title,
      length: activeItem.length,
      StartTimezone: null,
      start: startDate,
      end: endDate,
    };
    setData([newEvent, ...data]);
    setActiveItem(null);
  };

  const dragStart = (dataItem) => {
    setActiveItem(dataItem);
  };

  const handleDataChange = React.useCallback(
    ({ created, updated, deleted }) => {
      setData((old) =>
        old
          .filter(
            (item) =>
              deleted.find((current) => current.id === item.id) === undefined
          )
          .map(
            (item) => updated.find((current) => current.id === item.id) || item
          )
          .concat(
            created.map((item) => Object.assign({}, item, { id: guid() }))
          )
      );
    },
    [setData]
  );

  return (
    <ReorderContext.Provider value={{ dragStart }}>
      <DragAndDrop>
        <Droppable
          onDrop={handleDropItem}
          onDragOver={handleDragOver}
          childRef={MyDroppable}
        >
          <Scheduler
            editable={true}
            onDataChange={handleDataChange}
            data={data}
            defaultDate={new Date("2013/6/13")}
            item={CustomItem}
            ref={MyScheduler}
            resources={[
              {
                name: "Status",
                data: [
                  {
                    text: "Planned",
                    value: 1,
                    color: "#5392E4",
                  },
                  {
                    text: "Scheduled",
                    value: 2,
                    color: "#54677B",
                  },
                ],
                field: "StatusIDs",
                valueField: "value",
                textField: "text",
                colorField: "color",
              },
            ]}
          >
            <WeekView showWorkHours={false} />
            <MonthView />
          </Scheduler>
        </Droppable>
        <hr />
        <Grid
          data={gridData}
          dataItemKey={"ProductID"}
          rowRender={(row, rowProps) => (
            <DraggableRow elementProps={row.props} {...rowProps} />
          )}
        >
          <Column field="taskID" title="ID" cell={DragHandleCell} />
          <Column field="title" title="Name" cell={DragHandleCell} />
          <Column field="length" title="Length" cell={DragHandleCell} />
        </Grid>
      </DragAndDrop>
    </ReorderContext.Provider>
  );
};

export default CustomGrid;
