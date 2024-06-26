interface FormattedObject {
  displayName: string;
  id: string;
}

export default function setTitleAllObjects(allObjects: any[]): FormattedObject[] {
  return allObjects.map(obj => ({
    displayName: obj.name + " " + obj.address,
    id: obj.id
  }));
}
